// Same ink-only contrast rule as the application, evaluated once per theme choice.
const rgb = hex => [1,3,5].map(index => parseInt(hex.slice(index,index+2),16));
const luminance = hex => rgb(hex).map(value => {
  const channel = value / 255;
  return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
}).reduce((sum,value,index) => sum + value * [.2126,.7152,.0722][index],0);
export const contrast = (front,back) => {
  const a = luminance(front), b = luminance(back);
  return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
};
export function readableInk(color,background) {
  if (contrast(color,background) >= 4.5) return color;
  const source = rgb(color);
  const target = contrast('#000000',background) >= contrast('#ffffff',background) ? 0 : 255;
  let low = 0, high = 1, result = target ? '#ffffff' : '#000000';
  for (let step = 0; step < 12; step++) {
    const amount = (low+high)/2;
    const candidate = '#' + source.map(value => Math.round(value+(target-value)*amount).toString(16).padStart(2,'0')).join('');
    if (contrast(candidate,background) >= 4.5) { high = amount; result = candidate; }
    else low = amount;
  }
  return result;
}
