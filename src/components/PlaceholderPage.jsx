import Icon from './Icon.jsx'

export default function PlaceholderPage({ title, icon = 'shop' }) {
  return (
    <div className="card card--placeholder">
      <div className="placeholder__icon">
        <Icon name={icon} size={32} />
      </div>
      <h2>{title}</h2>
      <p>Cette section est en cours de construction. Revenez bientôt.</p>
    </div>
  )
}
