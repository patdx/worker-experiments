export type HxProps = {
  'hx-swap-oob'?: 'true';
  'hx-target'?: string;
  'hx-post'?: string;
  'hx-get'?: string;
  'hx-trigger'?: string;
  'hx-swap'?:
    | 'innerHTML'
    | 'outerHTML'
    | 'afterbegin'
    | 'beforebegin'
    | 'beforeend'
    | 'afterend'
    | 'none';
};

export const hx = (props?: HxProps) => props;
