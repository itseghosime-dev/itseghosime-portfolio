import {buildTheme} from '@sanity/themer'

export const studioTheme = buildTheme({
  light: {
    accent: '#3155D9',
    text: '#242424',
    background: '#FAF9F4',
    contrast: 92,
  },
  dark: {
    accent: '#7890FF',
    text: '#D9D9D6',
    background: '#171717',
    contrast: 92,
  },
})
