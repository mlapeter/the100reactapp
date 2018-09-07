// @flow
import * as React from "react";
import { inject } from "mobx-react/native";

import styleGuide from "./StyleGuide";
import type { Palette, StyleGuide } from "./StyleGuide";

type ElementConfig<Comp, InjectedProps> = $Diff<
  React.ElementConfig<Comp>,
  InjectedProps
>;

export type ThemeProps = {
  theme: Theme
};

export type StyleSheet<StyleNames: string> = { [name: StyleNames]: mixed };
export type StylesProps<StyleNames: string> = {
  styles: StyleSheet<StyleNames>
};

// eslint-disable-next-line max-len
export function withTheme<Props: {}, Comp: React.ComponentType<Props>>(
  C: Comp
): React.ComponentType<ElementConfig<Comp, ThemeProps>> {
  return inject("theme")(C);
}

// eslint-disable-next-line max-len
export function withStyles<
  StlNames: string,
  Props: {},
  Comp: React.ComponentType<Props>
>(
  styles: Theme => StyleSheet<StlNames>,
  C: Comp
): React.ComponentType<ElementConfig<Comp, StylesProps<StlNames>>> {
  return inject("theme")(({ theme, ...props }) => (
    <C styles={styles(theme)} {...props} />
  ));
}

export type ThemeName = "Music" | "Food" | "Travel" | "Social" | "Photography";
export type ThemeColors = {
  primary: string,
  secondary: string
};

export type Theme = {
  palette: { primary: string, secondary: string } & Palette,
  switchColors: ThemeColors => void
} & StyleGuide;

export const Colors: { [name: ThemeName]: ThemeColors } = {
  Music: {
    primary: "#00A5FF",
    secondary: "#e3f7ff"
  },
  Food: {
    primary: "#73C700",
    secondary: "#effae5"
  },
  Travel: {
    primary: "#FF9300",
    secondary: "#fff4e5"
  },
  Social: {
    primary: "#A237F3",
    secondary: "#f7ebfe"
  },
  Photography: {
    primary: "#FD4176",
    secondary: "#ffebf1"
  }
};

export const createTheme = (): Theme => ({
  palette: {
    primary: "#23272A",
    secondary: "#e6e6e6",
    ...styleGuide.palette
  },
  typography: { ...styleGuide.typography },
  spacing: { ...styleGuide.spacing },
  styles: { ...styleGuide.styles },
  switchColors(colors: ThemeColors) {
    this.palette.primary = colors.primary;
    this.palette.secondary = colors.secondary;
  }
});
