import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  AtSign,
  Bell,
  Bookmark,
  Calendar,
  ChartGantt,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CirclePlus,
  CircleQuestionMark,
  Clock,
  Command,
  Copy,
  CreditCard,
  Download,
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileText,
  Folder,
  Funnel,
  Globe,
  GripVertical,
  Hash,
  Heart,
  House,
  Image,
  Inbox,
  Info,
  Keyboard,
  LayoutGrid,
  Leaf,
  Link,
  List,
  LoaderCircle,
  Lock,
  LockOpen,
  LogIn,
  LogOut,
  type LucideIcon,
  type LucideProps,
  Mail,
  Maximize2,
  Menu,
  MessageSquare,
  Mic,
  Minimize2,
  Minus,
  Monitor,
  Moon,
  PanelLeft,
  Paperclip,
  Pause,
  Pencil,
  Play,
  Plus,
  Redo2,
  RefreshCw,
  Repeat,
  ShoppingBasket,
  Shovel,
  Ruler,
  MapPin,
  Search,
  Send,
  Settings,
  Share2,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Sprout,
  SquareDashedMousePointer,
  Star,
  Sun,
  Tag,
  Trash,
  TriangleAlert,
  Undo2,
  Upload,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { cn } from "./cn";

/**
 * The icon library. Apps import icons from @kit/ui, never from lucide-react, so every icon has the
 * same look and the set can change in this one file: 16px, a 1.5px line at every size (like Linear
 * and Notion), round ends, the text colour. Lucide (ISC licence) draws them; to add one, pick it on
 * lucide.dev, add a line below and put it in a group so /design shows it.
 */

export type IconProps = Omit<LucideProps, "ref">;
export type Icon = (props: IconProps) => React.JSX.Element;

function icon(Base: LucideIcon, name: string): Icon {
  const Styled = ({ size = 16, strokeWidth = 1.5, ...props }: IconProps) => (
    <Base size={size} strokeWidth={strokeWidth} nonScalingStroke aria-hidden={props["aria-label"] ? undefined : true} {...props} />
  );
  Styled.displayName = name;
  return Styled;
}

// Actions
export const PlusIcon = icon(Plus, "PlusIcon");
export const MinusIcon = icon(Minus, "MinusIcon");
export const CloseIcon = icon(X, "CloseIcon");
export const CheckIcon = icon(Check, "CheckIcon");
export const EditIcon = icon(Pencil, "EditIcon");
export const TrashIcon = icon(Trash, "TrashIcon");
export const CopyIcon = icon(Copy, "CopyIcon");
/** Select everything in a place, like a marquee in a design tool. */
export const SelectAllIcon = icon(SquareDashedMousePointer, "SelectAllIcon");
export const DownloadIcon = icon(Download, "DownloadIcon");
export const UploadIcon = icon(Upload, "UploadIcon");
export const ShareIcon = icon(Share2, "ShareIcon");
export const ExternalLinkIcon = icon(ExternalLink, "ExternalLinkIcon");
export const LinkIcon = icon(Link, "LinkIcon");
export const SearchIcon = icon(Search, "SearchIcon");
export const FilterIcon = icon(Funnel, "FilterIcon");
export const SlidersIcon = icon(SlidersHorizontal, "SlidersIcon");
export const MoreIcon = icon(Ellipsis, "MoreIcon");
export const MoreVerticalIcon = icon(EllipsisVertical, "MoreVerticalIcon");
export const RefreshIcon = icon(RefreshCw, "RefreshIcon");
/** Something that comes back: a recurring task. */
export const RepeatIcon = icon(Repeat, "RepeatIcon");
/** Things that start one after another: succession sowing, a staggered plan. */
export const StaggeredIcon = icon(ChartGantt, "StaggeredIcon");
/** A harvest, a basket of things. */
export const BasketIcon = icon(ShoppingBasket, "BasketIcon");
/** Planting out, digging. */
export const ShovelIcon = icon(Shovel, "ShovelIcon");
/** A size or a distance. */
export const RulerIcon = icon(Ruler, "RulerIcon");
/** A place: a spot, an address. */
export const MapPinIcon = icon(MapPin, "MapPinIcon");
export const UndoIcon = icon(Undo2, "UndoIcon");
export const RedoIcon = icon(Redo2, "RedoIcon");
export const SendIcon = icon(Send, "SendIcon");
export const AttachIcon = icon(Paperclip, "AttachIcon");
export const ArchiveIcon = icon(Archive, "ArchiveIcon");
export const DragHandleIcon = icon(GripVertical, "DragHandleIcon");
export const ExpandIcon = icon(Maximize2, "ExpandIcon");
export const CollapseIcon = icon(Minimize2, "CollapseIcon");

// Navigation
export const ChevronDownIcon = icon(ChevronDown, "ChevronDownIcon");
export const ChevronUpIcon = icon(ChevronUp, "ChevronUpIcon");
export const ChevronLeftIcon = icon(ChevronLeft, "ChevronLeftIcon");
export const ChevronRightIcon = icon(ChevronRight, "ChevronRightIcon");
export const ChevronsUpDownIcon = icon(ChevronsUpDown, "ChevronsUpDownIcon");
export const ArrowLeftIcon = icon(ArrowLeft, "ArrowLeftIcon");
export const ArrowRightIcon = icon(ArrowRight, "ArrowRightIcon");
export const ArrowUpIcon = icon(ArrowUp, "ArrowUpIcon");
export const ArrowDownIcon = icon(ArrowDown, "ArrowDownIcon");
export const ArrowUpRightIcon = icon(ArrowUpRight, "ArrowUpRightIcon");
export const MenuIcon = icon(Menu, "MenuIcon");
export const SidebarIcon = icon(PanelLeft, "SidebarIcon");
export const HomeIcon = icon(House, "HomeIcon");
export const GridIcon = icon(LayoutGrid, "GridIcon");
export const ListIcon = icon(List, "ListIcon");
export const SettingsIcon = icon(Settings, "SettingsIcon");
export const SignInIcon = icon(LogIn, "SignInIcon");
export const SignOutIcon = icon(LogOut, "SignOutIcon");
export const CommandIcon = icon(Command, "CommandIcon");
export const KeyboardIcon = icon(Keyboard, "KeyboardIcon");

// Things
export const UserIcon = icon(User, "UserIcon");
export const UsersIcon = icon(Users, "UsersIcon");
export const MailIcon = icon(Mail, "MailIcon");
export const InboxIcon = icon(Inbox, "InboxIcon");
export const BellIcon = icon(Bell, "BellIcon");
export const CalendarIcon = icon(Calendar, "CalendarIcon");
export const ClockIcon = icon(Clock, "ClockIcon");
export const FileIcon = icon(File, "FileIcon");
export const DocumentIcon = icon(FileText, "DocumentIcon");
export const FolderIcon = icon(Folder, "FolderIcon");
export const ImageIcon = icon(Image, "ImageIcon");
export const TagIcon = icon(Tag, "TagIcon");
export const StarIcon = icon(Star, "StarIcon");
export const HeartIcon = icon(Heart, "HeartIcon");
export const BookmarkIcon = icon(Bookmark, "BookmarkIcon");
export const LockIcon = icon(Lock, "LockIcon");
export const UnlockIcon = icon(LockOpen, "UnlockIcon");
export const EyeIcon = icon(Eye, "EyeIcon");
export const EyeOffIcon = icon(EyeOff, "EyeOffIcon");
export const GlobeIcon = icon(Globe, "GlobeIcon");
export const CardIcon = icon(CreditCard, "CardIcon");
export const SparklesIcon = icon(Sparkles, "SparklesIcon");
export const BoltIcon = icon(Zap, "BoltIcon");
export const MessageIcon = icon(MessageSquare, "MessageIcon");
export const HashIcon = icon(Hash, "HashIcon");
export const AtIcon = icon(AtSign, "AtIcon");
export const MicIcon = icon(Mic, "MicIcon");
export const PlayIcon = icon(Play, "PlayIcon");
export const PauseIcon = icon(Pause, "PauseIcon");
export const SproutIcon = icon(Sprout, "SproutIcon");
export const LeafIcon = icon(Leaf, "LeafIcon");

// Appearance and devices
export const SunIcon = icon(Sun, "SunIcon");
export const MoonIcon = icon(Moon, "MoonIcon");
export const MonitorIcon = icon(Monitor, "MonitorIcon");
export const PhoneIcon = icon(Smartphone, "PhoneIcon");

// Status
export const InfoIcon = icon(Info, "InfoIcon");
export const SuccessIcon = icon(CircleCheck, "SuccessIcon");
export const WarningIcon = icon(TriangleAlert, "WarningIcon");
export const ErrorIcon = icon(CircleAlert, "ErrorIcon");
export const HelpIcon = icon(CircleQuestionMark, "HelpIcon");
export const CircleIcon = icon(Circle, "CircleIcon");
export const CircleDashedIcon = icon(CircleDashed, "CircleDashedIcon");
export const CirclePlusIcon = icon(CirclePlus, "CirclePlusIcon");

const Spinning = icon(LoaderCircle, "SpinnerIcon");
/** For "working on it"; stands still for people who reduce motion. */
export const SpinnerIcon: Icon = ({ className, ...props }) => <Spinning className={cn("animate-spin motion-reduce:animate-none", className)} {...props} />;

/** Every icon by group, for /design. Add new icons here too. */
export const iconGroups: Record<string, Record<string, Icon>> = {
  Actions: {
    PlusIcon,
    MinusIcon,
    CloseIcon,
    CheckIcon,
    EditIcon,
    TrashIcon,
    CopyIcon,
    SelectAllIcon,
    DownloadIcon,
    UploadIcon,
    ShareIcon,
    ExternalLinkIcon,
    LinkIcon,
    SearchIcon,
    FilterIcon,
    SlidersIcon,
    MoreIcon,
    MoreVerticalIcon,
    RefreshIcon,
    RepeatIcon,
    StaggeredIcon,
    BasketIcon,
    ShovelIcon,
    RulerIcon,
    MapPinIcon,
    UndoIcon,
    RedoIcon,
    SendIcon,
    AttachIcon,
    ArchiveIcon,
    DragHandleIcon,
    ExpandIcon,
    CollapseIcon,
  },
  Navigation: {
    ChevronDownIcon,
    ChevronUpIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsUpDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowUpRightIcon,
    MenuIcon,
    SidebarIcon,
    HomeIcon,
    GridIcon,
    ListIcon,
    SettingsIcon,
    SignInIcon,
    SignOutIcon,
    CommandIcon,
    KeyboardIcon,
  },
  Things: {
    UserIcon,
    UsersIcon,
    MailIcon,
    InboxIcon,
    BellIcon,
    CalendarIcon,
    ClockIcon,
    FileIcon,
    DocumentIcon,
    FolderIcon,
    ImageIcon,
    TagIcon,
    StarIcon,
    HeartIcon,
    BookmarkIcon,
    LockIcon,
    UnlockIcon,
    EyeIcon,
    EyeOffIcon,
    GlobeIcon,
    CardIcon,
    SparklesIcon,
    BoltIcon,
    MessageIcon,
    HashIcon,
    AtIcon,
    MicIcon,
    PlayIcon,
    PauseIcon,
    SproutIcon,
    LeafIcon,
  },
  Appearance: { SunIcon, MoonIcon, MonitorIcon, PhoneIcon },
  Status: { InfoIcon, SuccessIcon, WarningIcon, ErrorIcon, HelpIcon, CircleIcon, CircleDashedIcon, CirclePlusIcon, SpinnerIcon },
};
