export function StudioIcon() {
  return (
    <picture>
      <source media="(prefers-color-scheme: dark)" srcSet="/static/studio-mark-light.svg" />
      <img
        src="/static/studio-mark.svg"
        alt=""
        width={28}
        height={28}
        style={{display: 'block'}}
      />
    </picture>
  )
}
