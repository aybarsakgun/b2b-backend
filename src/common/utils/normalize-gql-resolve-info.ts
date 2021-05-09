import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  SelectionNode,
} from "graphql";

export interface INormalizedGqlRequestedJoin {
  parent: string;
  joins: INormalizedGqlRequestedJoin[];
}

export interface INormalizedGqlRequestedPaths {
  root: string;
  relations: [string, string][];
}

export class NormalizeGqlResolveInfo {
  private readonly fragments: Record<string, FragmentDefinitionNode>;
  private readonly fieldNodes: readonly FieldNode[];
  private readonly isPaginated: boolean;

  private constructor(
    { fragments, fieldNodes }: GraphQLResolveInfo,
    isPaginated?: boolean
  ) {
    this.fragments = fragments;
    this.fieldNodes = fieldNodes;
    this.isPaginated = !!isPaginated;
  }

  private normalizeJoins(node: SelectionNode): INormalizedGqlRequestedJoin[] {
    switch (node.kind) {
      case "InlineFragment":
        return this.mapJoins(node.selectionSet.selections);
      case "FragmentSpread":
        return this.mapJoins(
          this.fragments[node.name.value]!.selectionSet.selections
        );
      case "Field": {
        const normalizedPath: INormalizedGqlRequestedJoin[] = [];
        if (node.selectionSet !== undefined) {
          normalizedPath.push({
            parent: node.name.value,
            joins: this.mapJoins(node.selectionSet.selections),
          });
        }
        return normalizedPath;
      }
    }
  }

  private mapJoins = (
    selections: readonly SelectionNode[]
  ): INormalizedGqlRequestedJoin[] => {
    return selections.reduce<INormalizedGqlRequestedJoin[]>(
      (paths, field, i) => {
        if (this.isPaginated && field["name"].value === "items") {
          return paths.concat(this.mapJoins(field["selectionSet"].selections));
        }
        return paths.concat(this.normalizeJoins(field));
      },
      []
    );
  };

  private fieldJoins(): INormalizedGqlRequestedJoin[] {
    return this.mapJoins(this.fieldNodes);
  }

  private requestedPaths(): INormalizedGqlRequestedPaths {
    const allFieldJoins = this.fieldJoins();
    const fieldJoins = allFieldJoins[allFieldJoins.length - 1]!;
    const fieldPaths: INormalizedGqlRequestedPaths = {
      root: fieldJoins.parent,
      relations: [],
    };
    const fieldJoinsStack: INormalizedGqlRequestedJoin[] = [fieldJoins];
    while (fieldJoinsStack.length > 0) {
      const currentFieldJoins = fieldJoinsStack.pop()!;
      currentFieldJoins.joins.forEach((fieldJoins) => {
        fieldJoinsStack.push({
          parent: `${currentFieldJoins.parent}__${fieldJoins.parent}`,
          joins: fieldJoins.joins,
        });
        fieldPaths.relations.push([
          currentFieldJoins.parent,
          fieldJoins.parent,
        ]);
      });
    }
    return fieldPaths;
  }

  static readonly RequestedPaths = createParamDecorator<
    {
      isPaginated: boolean;
    },
    ExecutionContext
  >((options, ctx) =>
    new NormalizeGqlResolveInfo(
      GqlExecutionContext.create(ctx).getInfo<GraphQLResolveInfo>(),
      options?.isPaginated
    ).requestedPaths()
  );
}
