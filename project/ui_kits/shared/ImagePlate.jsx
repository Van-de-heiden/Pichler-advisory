// ImagePlate.jsx — refined placeholder standing in for commissioned warm
// editorial photography (architecture, marble, tailored interiors). Calm,
// no loud gradients. Replace with real imagery in production.
(function () {
  const TONES = {
    charcoal: { bg: 'var(--charcoal)', wash: 'rgba(90,15,27,0.34)', markOpacity: 0.10, invert: true,  label: 'var(--stone)' },
    bordeaux: { bg: 'var(--bordeaux-900)', wash: 'rgba(122,29,43,0.45)', markOpacity: 0.14, invert: true, label: 'var(--gold-300)' },
    stone:    { bg: 'var(--mist)', wash: 'rgba(168,157,144,0.16)', markOpacity: 0.07, invert: false, label: 'var(--taupe)' },
    ivory:    { bg: 'var(--base-ivory)', wash: 'rgba(168,157,144,0.10)', markOpacity: 0.06, invert: false, label: 'var(--taupe)' },
  };

  function ImagePlate({ tone = 'charcoal', label, ratio = '4 / 3', radius = 'var(--radius-lg)', style = {}, children }) {
    const t = TONES[tone] || TONES.charcoal;
    return React.createElement('div', {
      style: {
        position: 'relative', aspectRatio: ratio, borderRadius: radius,
        overflow: 'hidden', background: t.bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center', ...style,
      },
    },
      React.createElement('div', { style: {
        position: 'absolute', inset: 0,
        background: `radial-gradient(120% 90% at 78% 12%, ${t.wash}, transparent 62%)`,
      }}),
      React.createElement('img', { src: '../../assets/pcg-shield.png', alt: '', style: {
        position: 'absolute', width: '42%', maxWidth: 200, opacity: t.markOpacity,
        filter: t.invert ? 'brightness(0) invert(1)' : 'none',
      }}),
      label && React.createElement('span', { style: {
        position: 'absolute', bottom: 16, left: 18, fontFamily: 'var(--font-body)',
        fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: t.label, fontWeight: 600, zIndex: 2,
      }}, label),
      children,
    );
  }

  window.ImagePlate = ImagePlate;
})();
