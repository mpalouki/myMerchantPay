import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Icon from './Icon.jsx';

// A payment link's QR code (pages/PaymentLinkDetails.jsx), drawn in the browser, downloadable as
// a PNG to print or post. It encodes the link URL, so it never expires: deactivating the link
// makes it show the "unavailable" page.
export default function PaymentLinkQr({ url, fileName }) {
  const [image, setImage] = useState({ url: null, src: null });

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, { width: 640, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#16173f', light: '#ffffff' } })
      .then((src) => !cancelled && setImage({ url, src }))
      .catch(() => !cancelled && setImage({ url, src: null }));
    return () => {
      cancelled = true;
    };
  }, [url]);

  const src = image.url === url ? image.src : null;

  return (
    <div className="plink-qr">
      <div className="plink-qr__image">{src ? <img src={src} alt={`QR code du lien ${url}`} width={180} height={180} /> : <span>…</span>}</div>
      <a className={`btn btn--outline btn--sm${src ? '' : ' is-disabled'}`} href={src ?? undefined} download={`${fileName}.png`} aria-disabled={!src}>
        <Icon name="qr" size={14} /> Télécharger le QR code (PNG)
      </a>
    </div>
  );
}
