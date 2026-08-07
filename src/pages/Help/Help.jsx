import styles from "./Help.module.css";

const SHORTCUTS = [
  { keys: ["/"], description: "Jump to Search" },
  { keys: ["Ctrl", "K"], description: "Open the command palette" },
  { keys: ["N"], description: "Add a card to the first list (on a board)" },
  { keys: ["L"], description: "Add a new list (on a board)" },
  { keys: ["Esc"], description: "Close the open modal" },
];

export default function Help() {
  return (
    <div className={styles.page}>
      <h1>Help</h1>
      <p className={styles.subtitle}>Keyboard shortcuts and quick reference.</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Keyboard shortcuts</h2>
        <table className={styles.table}>
          <tbody>
            {SHORTCUTS.map((shortcut) => (
              <tr key={shortcut.description}>
                <td className={styles.keysCell}>
                  {shortcut.keys.map((key) => (
                    <kbd key={key} className={styles.key}>
                      {key}
                    </kbd>
                  ))}
                </td>
                <td className={styles.descriptionCell}>{shortcut.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
