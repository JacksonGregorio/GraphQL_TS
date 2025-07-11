import { GraphQLResolveInfo } from 'graphql';

export function getRequestedFields(info: GraphQLResolveInfo): string[] {
  const selections = info.fieldNodes[0].selectionSet?.selections;
  if (!selections) return [];
  
  return selections
    .filter((selection): selection is any => selection.kind === 'Field')
    .map((selection: any) => selection.name.value);
}

export function getSequelizeAttributes(requestedFields: string[]): string[] {

  const attributes = ['id'];
  
  const fieldMapping: { [key: string]: string } = {
    'id': 'id',
    'name': 'name',
    'email': 'email',
    'position': 'position',
    'isActive': 'isActive',
    'createdAt': 'createdAt',
    'updatedAt': 'updatedAt'
  };
  
  requestedFields.forEach(field => {
    if (fieldMapping[field] && !attributes.includes(fieldMapping[field])) {
      attributes.push(fieldMapping[field]);
    }
  });
  
  return attributes;
}
