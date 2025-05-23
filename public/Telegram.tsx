import Link from "next/link";

export default function Telegram({ fill }: { fill?: string }) {
  return (
    <Link
      prefetch={true}
      href="https://t.me/pixlogistic"
      className={`hover:scale-110 transition-all`}
    >
      <svg
        width="39"
        height="38"
        viewBox="0 0 39 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.5 0C9.00669 0 0.5 8.50669 0.5 19C0.5 29.4933 9.00669 38 19.5 38C29.9933 38 38.5 29.4933 38.5 19C38.5 8.50669 29.9933 0 19.5 0ZM29.4398 14.8206C28.85 18.8673 28.1757 22.9132 27.5005 26.96C27.2479 28.8984 26.2364 29.9107 24.129 28.7303L17.5539 24.0937C16.627 23.3349 16.8796 22.7451 17.6385 21.9863L23.7081 16.2537C25.3094 14.6524 24.5515 14.0618 22.6967 15.3268L14.3514 20.9748C13.1709 21.8181 11.9068 21.8181 10.5581 21.3964L7.69186 20.385C5.83707 19.7106 7.2702 18.9518 8.19802 18.5302C13.4244 16.3382 19.7467 13.2193 25.2266 11.1119C30.2848 9.25706 30.2003 9.76322 29.4415 14.8206H29.4398Z"
          fill={fill ? fill : "white"}
        />
      </svg>
    </Link>
  );
}
