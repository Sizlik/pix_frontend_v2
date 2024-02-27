export default function TabButton({
  titles,
  state,
  setState,
  className,
  onClick,
}: {
  titles: string[];
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  onClick?: (title: string) => void;
}) {
  return (
    <div className="flex gap-1">
      {titles.map((title, index) => {
        return (
          <button
            className={`${state == title && "bg-black text-white"} px-4 py-2 border-b transition-all ${className}`}
            key={index}
            onClick={() => {
              setState(title);
              onClick && onClick(title);
            }}
          >
            {title}
          </button>
        );
      })}
    </div>
  );
}
