import { useState, useCallback } from "react";

export type TweakValues = {
  accentHue: number;
  dark: boolean;
  defaultType: string;
  hashAlgo: string;
};

export function useTweaks(defaults: TweakValues): [TweakValues, (key: keyof TweakValues, val: unknown) => void] {
  const [values, setValues] = useState<TweakValues>(defaults);
  const setTweak = useCallback((key: keyof TweakValues, val: unknown) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);
  return [values, setTweak];
}
