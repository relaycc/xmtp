import { css } from "styled-components";

const black = css`
  font-family: "Satoshi-Black";
`;

const bold = css`
  font-family: "Satoshi-Bold";
`;

const regular = css`
  font-family: "Satoshi-Regular";
`;

const medium = css`
  font-family: "Satoshi-Medium";
`;

export const spaceMonoMdSemibold = css`
  font-family: "Space Mono", monospace;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  font-style: normal;
  vertical-align: middle;
`;

export const spaceMonoMdBold = css`
  font-family: "Space Mono", monospace;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  font-style: normal;
  vertical-align: middle;
`;

export const spaceMonoSmBold = css`
  font-family: "Space Mono", monospace;
  font-size: 14px;
  line-height: 20px;
  font-weight: 900;
  font-style: normal;
  vertical-align: middle;
`;

export const spaceMonoXsRegular = css`
  font-family: "Space Mono", monospace;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  font-style: normal;
  vertical-align: middle;
`;

export const spaceMonoLgBlack = css`
  font-family: "Space Mono", monospace;
  font-style: normal;
  font-weight: 900;
  font-size: 24px;
  line-height: 30px;
`;

export const spaceMonoXlBlack = css`
  font-family: "Space Mono", monospace;
  font-style: normal;
  font-weight: 900;
  font-size: 32px;
  line-height: 43.2px;
`;

export const displayXsBold = css`
  font-size: 24px;
  line-height: 32px;
  vertical-align: middle;
  ${bold};
`;

export const textXxlBlack = css`
  ${black};
  font-style: normal;
  font-weight: 900;
  font-size: 40px;
  line-height: 54px;
`;

export const textXlBlack = css`
  ${black};
  font-style: normal;
  font-weight: 900;
  font-size: 32px;
  line-height: 43.2px;
`;

export const textLgBlack = css`
  ${bold};
  font-style: normal;
  font-size: 24px;
  line-height: 30px;
`;

export const textLgSemibold = css`
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  font-style: normal;
  vertical-align: middle;
  ${medium};
`;

export const textMdSemiBold = css`
  font-size: 16px;
  line-height: 24px;
  vertical-align: middle;
  ${medium};
`;

export const textMdRegular = css`
  font-size: 16px;
  line-height: 24px;
  vertical-align: middle;
  ${regular};
`;

export const textSmBold = css`
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
  ${bold};
`;

export const textSmRegular = css`
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
`;

export const textXsMedium = css`
  font-size: 12px;
  line-height: 18px;
  ${medium};
`;

export const textXsRegular = css`
  font-size: 12px;
  line-height: 18px;
  font-style: normal;
  vertical-align: middle;
  ${regular};
`;
