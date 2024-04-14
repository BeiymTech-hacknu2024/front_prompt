// memoized inner shadow filter
// Pre-render the filter components outside the component to avoid unnecessary re-renders
const innerShadowFilter = (
  <defs>
    <filter id="inner-shadow-filter">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feColorMatrix
        in="SourceAlpha"
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        result="hardAlpha"
      />
      <feMorphology
        radius="1"
        operator="erode"
        in="SourceAlpha"
        result="effect1_innerShadow_354_131"
      />
      <feOffset />
      <feGaussianBlur stdDeviation="5" />
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
      />
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_354_131" />
    </filter>
  </defs>
);

export default innerShadowFilter;
