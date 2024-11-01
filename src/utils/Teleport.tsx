import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Teleport = ({ rootId, children }: { rootId: string, children: JSX.Element|React.ReactNode}) => {
  const [ element, setElement ] = useState<Element | null>(null);

  useEffect(() => {
    const targetElement = document.getElementById(rootId);
    setElement(targetElement);
  }, [ rootId, children ]);

  if (!element) return null;
  
  return ReactDOM.createPortal(
    children,
    (element as Element|DocumentFragment)
  );
};

export default Teleport;