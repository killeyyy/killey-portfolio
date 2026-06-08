// Central icon map so data files can reference icons by name (string).
import {
  Gamepad2,
  Megaphone,
  PenTool,
  Sparkles,
  GraduationCap,
  Triangle,
  Github,
  NotebookPen,
  Mail,
  Instagram,
  Linkedin,
} from "lucide-react";

const MAP = {
  Gamepad2,
  Megaphone,
  PenTool,
  Sparkles,
  GraduationCap,
  Triangle,
  Github,
  NotebookPen,
  Mail,
  Instagram,
  Linkedin,
};

/** Render a lucide icon by name; renders nothing if the name is unknown. */
export default function Icon({ name, ...props }) {
  const Cmp = MAP[name];
  return Cmp ? <Cmp {...props} /> : null;
}
