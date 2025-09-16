// Global ambient declarations to ease local development without installing full @types
declare module 'lucide-react'
declare module 'react'

type EventHandler<E = any> = (event: E) => void

interface HTMLAttributes {
  className?: string
  id?: string
  style?: any
  children?: any
  onClick?: EventHandler
  onChange?: EventHandler<any>
  [key: string]: any
}

declare namespace JSX {
  interface IntrinsicElements {
    div: HTMLAttributes
    span: HTMLAttributes
    p: HTMLAttributes
    input: HTMLAttributes
    textarea: HTMLAttributes
    select: HTMLAttributes
    option: HTMLAttributes
    form: HTMLAttributes
    button: HTMLAttributes
    label: HTMLAttributes
    main: HTMLAttributes
    header: HTMLAttributes
    footer: HTMLAttributes
    section: HTMLAttributes
    article: HTMLAttributes
    [elemName: string]: HTMLAttributes
  }
}

declare namespace React {
  interface HTMLAttributes<T = any> {
    className?: string
    [key: string]: any
  }
  interface ChangeEvent<T = any> {
    target: any
  }
}
