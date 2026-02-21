"use client";

import * as React from "react";

type ClassValue = string | number | boolean | null | undefined;

function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Settings2Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M20 7h-9" />
    <path d="M14 17H5" />
    <circle cx="17" cy="17" r="3" />
    <circle cx="7" cy="7" r="3" />
  </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 5.25L12 18.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.75 12L12 5.25L5.25 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const PaintBrushIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M5 21a3 3 0 0 1 3-3h2l7-7a2 2 0 1 0-3-3l-7 7v2a3 3 0 0 1-3 3Z" />
    <path d="M14 7l3 3" />
  </svg>
);

const TelescopeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="m14 4 6 6" />
    <path d="M6 21h6" />
    <path d="M10 6 3 13l4 4 7-7" />
    <path d="m12 14 4 7" />
  </svg>
);

const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 7a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9Z" />
    <path d="M10 21h4" />
  </svg>
);

const MicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
  </svg>
);

const toolsList = [
  { id: "createImage", name: "Create an image", shortName: "Image", icon: PaintBrushIcon },
  { id: "searchWeb", name: "Search the web", shortName: "Search", icon: GlobeIcon },
  { id: "writeCode", name: "Write code", shortName: "Write", icon: PencilIcon },
  { id: "deepResearch", name: "Run deep research", shortName: "Deep Search", icon: TelescopeIcon, extra: "5 left" },
  { id: "thinkLonger", name: "Think for longer", shortName: "Think", icon: LightbulbIcon },
];

export type PromptAreaPayload = {
  prompt: string;
  images: { mimeType: string; data: string }[];
  selectedTool: string | null;
  useSearch: boolean;
};

type PromptAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  onGenerate?: (payload: PromptAreaPayload) => Promise<void> | void;
  loading?: boolean;
};

const parseImageDataUrl = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
};

export const PromptArea = React.forwardRef<HTMLTextAreaElement, PromptAreaProps>(
  ({ className, onGenerate, loading = false, ...props }, ref) => {
    const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [value, setValue] = React.useState("");
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [selectedTool, setSelectedTool] = React.useState<string | null>(null);
    const [isToolsOpen, setIsToolsOpen] = React.useState(false);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useImperativeHandle(ref, () => internalTextareaRef.current!, []);

    React.useLayoutEffect(() => {
      const textarea = internalTextareaRef.current;
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
    }, [value]);

    React.useEffect(() => {
      const closeTools = () => setIsToolsOpen(false);
      if (!isToolsOpen) return;
      window.addEventListener("click", closeTools);
      return () => window.removeEventListener("click", closeTools);
    }, [isToolsOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    const handlePlusClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      }
      event.target.value = "";
    };

    const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const hasValue = value.trim().length > 0 || Boolean(imagePreview);
    const isBusy = loading || isSubmitting;
    const activeTool = selectedTool ? toolsList.find((tool) => tool.id === selectedTool) : null;
    const ActiveToolIcon = activeTool?.icon;

    const handleGenerate = async () => {
      if (!hasValue || isBusy || !onGenerate) return;

      const images = imagePreview ? [parseImageDataUrl(imagePreview)].filter(Boolean) : [];
      const normalizedImages = images as { mimeType: string; data: string }[];

      try {
        setIsSubmitting(true);
        await onGenerate({
          prompt: value.trim(),
          images: normalizedImages,
          selectedTool,
          useSearch: selectedTool === "searchWeb" || selectedTool === "deepResearch",
        });
        setValue("");
        setImagePreview(null);
        setSelectedTool(null);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div
        className={cn(
          "relative flex w-full flex-col rounded-[30px] border border-white/30 bg-white/[0.08] p-2 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl",
          className,
        )}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

        {isImagePreviewOpen && imagePreview ? (
          <button
            type="button"
            onClick={() => setIsImagePreviewOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm"
          >
            <img src={imagePreview} alt="Full size preview" className="max-h-[88vh] max-w-[88vw] rounded-[24px] object-contain" />
          </button>
        ) : null}

        {imagePreview ? (
          <div className="relative mb-1 w-fit rounded-2xl p-1">
            <button type="button" className="transition-transform hover:scale-[1.01]" onClick={() => setIsImagePreviewOpen(true)}>
              <img src={imagePreview} alt="Image preview" className="h-16 w-16 rounded-2xl object-cover" />
            </button>
            <button
              onClick={handleRemoveImage}
              className="absolute right-2 top-2 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
              aria-label="Remove image"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </div>
        ) : null}

        <textarea
          ref={internalTextareaRef}
          rows={1}
          value={value}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void handleGenerate();
            }
          }}
          placeholder="프롬프트를 입력하세요..."
          className="custom-scrollbar min-h-12 w-full resize-none border-0 bg-transparent p-3 text-white placeholder:text-white/55 focus-visible:outline-none"
          {...props}
        />

        <div className="mt-1 p-1 pt-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlusClick}
              disabled={isBusy}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white transition hover:bg-white/[0.14]"
              title="Attach image"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="sr-only">Attach image</span>
            </button>

            <div className="relative">
              <button
                type="button"
                disabled={isBusy}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsToolsOpen((prev) => !prev);
                }}
                className="flex h-9 items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-3 text-xs text-white transition hover:bg-white/[0.14]"
                title="Explore tools"
              >
                <Settings2Icon className="h-4 w-4" />
                {!selectedTool ? "Tools" : null}
              </button>

              {isToolsOpen ? (
                <div
                  className="absolute bottom-11 left-0 z-20 w-64 rounded-2xl border border-white/20 bg-black/85 p-2 text-white shadow-[0_14px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-1">
                    {toolsList.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setSelectedTool(tool.id);
                          setIsToolsOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl p-2 text-left text-sm transition hover:bg-white/[0.1]"
                      >
                        <tool.icon className="h-4 w-4" />
                        <span>{tool.name}</span>
                        {tool.extra ? <span className="ml-auto text-xs text-white/60">{tool.extra}</span> : null}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {activeTool ? (
              <>
                <div className="h-4 w-px bg-white/25" />
                <button
                  onClick={() => setSelectedTool(null)}
                  disabled={isBusy}
                  className="flex h-9 items-center gap-2 rounded-full border border-sky-300/30 bg-sky-300/10 px-3 text-xs text-sky-200 transition hover:bg-sky-300/20"
                >
                  {ActiveToolIcon ? <ActiveToolIcon className="h-4 w-4" /> : null}
                  {activeTool.shortName}
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </>
            ) : null}

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                disabled={isBusy}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white transition hover:bg-white/[0.14]"
                title="Record voice"
              >
                <MicIcon className="h-4.5 w-4.5" />
                <span className="sr-only">Record voice</span>
              </button>

              <button
                type="button"
                onClick={() => void handleGenerate()}
                disabled={!hasValue || isBusy}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:bg-white/40"
                title="Send"
              >
                <SendIcon className="h-4.5 w-4.5" />
                <span className="sr-only">Send message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

PromptArea.displayName = "PromptArea";
