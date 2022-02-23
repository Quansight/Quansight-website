import Placeholder from './Placeholder'

const Components = {
  Placeholder,
}

const Blocks = ({ blok, idx, ...props }) => {
  if (blok && typeof Components[blok.component] !== 'undefined') {
    const Component = Components[blok.component]

    return <Component blok={blok} idx={idx} {...props} />
  }
  return <Placeholder componentName={blok ? blok.component : null} />
}

export default Blocks
