export function repeatString(str: string, num: number): string {
  return num > 0 ? str.repeat(num) : ''
}

export function trimEdeg(str: string): string {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

export function trimFirst(str: string): string {
  return str.replace(/(^\s*)/g, '')
}

export function trimFirstLength(str: string): number {
  return str.length - trimFirst(str).length
}

export function trimLinefeed(str: string): string {
  return str.replace(/^\n*/, '')
}

export function trimFirstLinefeedLength(str: string): number {
  return trimFirstLength(trimLinefeed(str))
}

export function replaceFirstATSymbol(str: string, temp = '$'): string {
  return str.replace(/^\$|/, temp)
}

export function getCharLength(str: string, char: string): number {
  return str.split(char).length - 1
}

export function nodesToJSON(nodes: any[]): any[] {
  return nodes.map(node =>
    Object.assign(
      {
        // default in case not in node
        nodes: []
      },
      node.toJSON()
    )
  )
}

export function get(obj: any, pathArray: any, defaultValue?: any) {
  if (obj == null) {
    return defaultValue;
  }

  let value = obj

  pathArray = [].concat(pathArray)

  for (let i = 0; i < pathArray.length; i += 1) {
    const key = pathArray[i]
    value = value[key];
    if (value == null) {
      return defaultValue;
    }
  }

  return value;
}
