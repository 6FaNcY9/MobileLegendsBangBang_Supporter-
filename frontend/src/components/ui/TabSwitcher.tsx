import styles from './TabSwitcher.module.css'

interface Tab {
  id: string
  label: string
}

interface TabSwitcherProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
}

export const TabSwitcher = ({ tabs, activeTab, onTabChange }: TabSwitcherProps) => (
  <div role="tablist" aria-label="View options" className={styles.tablist}>
    {tabs.map((tab) => (
      <button
        role="tab"
        key={tab.id}
        aria-selected={tab.id === activeTab}
        className={tab.id === activeTab ? styles.active : styles.tab}
        onClick={() => onTabChange(tab.id)}
        type="button"
      >
        {tab.label}
      </button>
    ))}
  </div>
)

export default TabSwitcher
