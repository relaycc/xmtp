import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    scale: {
      zero: "0rem";
      one: "0.25rem";
      two: "0.5rem";
      three: "0.75rem";
      four: "1rem";
      five: "1.25rem";
      six: "1.5rem";
      seven: "1.75rem";
      eight: "2rem";
      nine: "2.25rem";
      ten: "2.5rem";
      eleven: "2.75rem";
      twelve: "3rem";
      sixteen: "4rem";
      double: "6rem";
      triple: "9rem";
    };
    colors: {
      gray: {
        25: string;
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      primary: {
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      secondary: {
        100: string;
        300: string;
        500: string;
        700: string;
        900: string;
      };
      accent: {
        100: string;
        300: string;
        500: string;
        700: string;
        900: string;
      };
      error: {
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      warning: {
        25: string;
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      success: {
        25: string;
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
    };
  }
}
