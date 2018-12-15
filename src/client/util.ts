export interface IMapOfBool {
  [key: string]: boolean
}

export function argsToMap(args: string[]): IMapOfBool {
  return args.reduce((o: IMapOfBool, key) => {
    o[key] = true
    return o
  }, {} as IMapOfBool)
}

export function openLink(href: string) {
  window.open(href, '_blank')
}

export function link(href: string): string {
  const output = 'Attempting to open a window with link: ' +
    '<a href="' + href + '" target="_blank">' + href + '</a>\n' +
    'If you have a popup blocker, click on the link above'
  openLink(href)
  return output
}

export function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight)
}
