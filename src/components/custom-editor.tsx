"use client"

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Eye } from "lucide-react";

function EButton({ 
    onClick,
    children
}: {
    onClick: React.MouseEventHandler,
    children?: React.ReactNode
}) {
    return (
        <Button 
            variant="ghost" 
            type="button"
            className="size-6"
            onClick={onClick}
        >
            {children}
        </Button>
    );
}

export function CustomEditor({
    content,
    onChange
}: {
    content?: string,
    onChange?: (value: string) => void
}) {
    const editorRef = useRef<HTMLDivElement>(null);

    function formatText(tag: keyof HTMLElementTagNameMap) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
      
        const range = selection.getRangeAt(0);
        const wrapper = document.createElement(tag);
        range.surroundContents(wrapper);

        if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }

    // function exec(command: string) {
    //     document.execCommand(command, false);
    //     if (onChange && editorRef.current) {
    //         onChange(editorRef.current.innerHTML);
    //     }
    // }

    return (
        <div className="rounded">
            {/* Toolbar */}
            <div className="flex p-1 border">
                <EButton onClick={() => formatText("strong")}><Bold /></EButton>
                <EButton onClick={() => formatText("em")}><Italic /></EButton>
                <EButton onClick={() => formatText("u")}><Underline /></EButton>
                <EButton onClick={() => console.log("Content:", content)}><Eye /></EButton>
            </div>

            {/* Editor area */}
            <div
                ref={editorRef}
                className="min-h-[200px] p-3 border bg-background"
                contentEditable
                onInput={() => onChange?.(editorRef.current?.innerHTML || "")}
            >
            </div>
        </div>
    );
}