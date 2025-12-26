declare module "csstype" {
  export type StandardCSSValue = string | number;

  export namespace Property {
    export type FontLanguageOverride = StandardCSSValue;
  }

  export interface StandardProperties<
    TLength = StandardCSSValue,
    TTime = StandardCSSValue
  > {
    [property: string]: string | number | undefined;
  }

  export interface StandardShorthandProperties<
    TLength = StandardCSSValue,
    TTime = StandardCSSValue
  > extends StandardProperties<TLength, TTime> {}

  export interface StandardLonghandProperties<
    TLength = StandardCSSValue,
    TTime = StandardCSSValue
  > extends StandardProperties<TLength, TTime> {}

  export interface VendorProperties<
    TLength = StandardCSSValue,
    TTime = StandardCSSValue
  > extends StandardProperties<TLength, TTime> {}

  export interface ObsoleteProperties<
    TLength = StandardCSSValue,
    TTime = StandardCSSValue
  > extends StandardProperties<TLength, TTime> {}

  export interface Properties<
    TLength = StandardCSSValue,
    TTime = StandardCSSValue
  >
    extends StandardLonghandProperties<TLength, TTime>,
      StandardShorthandProperties<TLength, TTime>,
      VendorProperties<TLength, TTime>,
      ObsoleteProperties<TLength, TTime> {}

  export interface PropertiesHyphen<
    TLength = StandardCSSValue,
    TTime = StandardCSSValue
  > extends Properties<TLength, TTime> {}

  export interface PropertiesFallback<
    TLength = StandardCSSValue,
    TTime = StandardCSSValue
  > extends Properties<TLength, TTime> {}
}
