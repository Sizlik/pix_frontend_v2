export default function OpenCloseButton({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <svg
      width="54"
      height="46"
      viewBox="0 0 54 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <rect width="53.9955" height="45.2871" rx="15" fill="white" />
      <rect
        x="0.5"
        y="0.5"
        width="52.9955"
        height="44.2871"
        rx="14.5"
        stroke="black"
        strokeOpacity="0.2"
      />
      <path
        d="M30.1796 28.1435L23.4978 22.7715L30.4978 17.1435"
        stroke="#6A6A6A"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
    </svg>
  );
}
