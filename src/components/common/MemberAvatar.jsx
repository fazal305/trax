import { useMemo } from "react";
import { generateAvatarDataUri } from "../../utils/avatar";
import styles from "./MemberAvatar.module.css";

const SIZES = { sm: 20, md: 28, lg: 40 };

export function MemberAvatar({ member, size = "md" }) {
  const px = SIZES[size];
  const src = useMemo(() => generateAvatarDataUri(member.avatarSeed), [member.avatarSeed]);

  return (
    <img
      src={src}
      alt={member.name}
      title={member.name}
      width={px}
      height={px}
      className={styles.avatar}
      style={{ width: px, height: px, borderColor: member.color ?? "var(--color-border)" }}
    />
  );
}
