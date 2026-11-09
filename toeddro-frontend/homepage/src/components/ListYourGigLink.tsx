import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ListYourGigLinkProps {
  className?: string;
  onClick?: () => void;
}

const ListYourGigLink = ({ className, onClick }: ListYourGigLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.();

    if (location.pathname === "/") {
      window.dispatchEvent(new CustomEvent("toeddro:scrollToCta"));
    } else {
      sessionStorage.setItem("toeddro:scrollToListYourGig", "true");
      navigate("/");
    }
  };

  return (
    <a
      href="#submit"
      onClick={handleClick}
      className={cn("hover:text-secondary", className)}
    >
      List your gig
    </a>
  );
};

export { ListYourGigLink };
