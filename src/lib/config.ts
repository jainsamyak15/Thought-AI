export const DEFAULT_CONFIG = {
    logo: {
      model: "black-forest-labs/FLUX.1-schnell-Free",
      steps: 4,
      n: 1,
      width: 512,
      height: 512,
    },
    banner: {
      model: "black-forest-labs/FLUX.1-schnell-Free",
      steps: 4,
      n: 1,
      width: 1280,
      height: 720,
    },
  };
  
  // banner dimension for youtube
  
  /* the original banner dimensions acc. to youtube
  export const BANNER_DIMENSIONS = {
    TV: { width: 2560, height: 1440 },
    DESKTOP: { width: 2560, height: 423 },
    SAFE_AREA: { width: 1546, height: 423 },
  };
  */
  
  // banner dimension due to api limitations
  
  export const BANNER_DIMENSIONS = {
    TV: { width: 1792, height: 1008 },
    DESKTOP: { width: 1792, height: 304 },
    SAFE_AREA: { width: 1088, height: 304 }
  };