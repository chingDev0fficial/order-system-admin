import { cn } from '@/lib/utils';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react';
import React from 'react';

interface RichTextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    minHeight?: string;
}

export function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Enter text...',
    className,
    disabled = false,
    minHeight = '200px',
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                        class: 'min-h-[1em]',
                    },
                },
            }),
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none p-4',
            },
        },
    });

    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div
            className={cn(
                'relative w-full overflow-hidden rounded-lg border border-gray-300 bg-white transition-all',
                'focus-within:border-[#F96901] focus-within:ring-1 focus-within:ring-[#F96901]',
                disabled && 'cursor-not-allowed bg-gray-50 opacity-60',
                className,
            )}
        >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled}
                    className={cn(
                        'rounded p-2 transition-colors hover:bg-gray-200',
                        editor.isActive('bold')
                            ? 'bg-[#F96901] text-white hover:bg-[#E05E01]'
                            : 'text-gray-700',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                    title="Bold"
                >
                    <Bold size={18} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled}
                    className={cn(
                        'rounded p-2 transition-colors hover:bg-gray-200',
                        editor.isActive('italic')
                            ? 'bg-[#F96901] text-white hover:bg-[#E05E01]'
                            : 'text-gray-700',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                    title="Italic"
                >
                    <Italic size={18} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={disabled}
                    className={cn(
                        'rounded p-2 transition-colors hover:bg-gray-200',
                        editor.isActive('strike')
                            ? 'bg-[#F96901] text-white hover:bg-[#E05E01]'
                            : 'text-gray-700',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                    title="Strikethrough"
                >
                    <Strikethrough size={18} />
                </button>

                <div className="mx-1 h-6 w-px bg-gray-300" />

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    disabled={disabled}
                    className={cn(
                        'rounded p-2 transition-colors hover:bg-gray-200',
                        editor.isActive('bulletList')
                            ? 'bg-[#F96901] text-white hover:bg-[#E05E01]'
                            : 'text-gray-700',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                    title="Bullet List"
                >
                    <List size={18} />
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    disabled={disabled}
                    className={cn(
                        'rounded p-2 transition-colors hover:bg-gray-200',
                        editor.isActive('orderedList')
                            ? 'bg-[#F96901] text-white hover:bg-[#E05E01]'
                            : 'text-gray-700',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                    title="Numbered List"
                >
                    <ListOrdered size={18} />
                </button>

                <div className="mx-1 h-6 w-px bg-gray-300" />

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    disabled={disabled}
                    className={cn(
                        'rounded px-2 py-1 font-semibold transition-colors hover:bg-gray-200',
                        editor.isActive('heading', { level: 2 })
                            ? 'bg-[#F96901] text-white hover:bg-[#E05E01]'
                            : 'text-gray-700',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                    title="Heading"
                >
                    H2
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    disabled={disabled}
                    className={cn(
                        'rounded px-2 py-1 font-semibold transition-colors hover:bg-gray-200',
                        editor.isActive('heading', { level: 3 })
                            ? 'bg-[#F96901] text-white hover:bg-[#E05E01]'
                            : 'text-gray-700',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                    title="Subheading"
                >
                    H3
                </button>
            </div>

            {/* Editor Content with Placeholder */}
            <div className="relative" style={{ minHeight }}>
                {!value && editor.isEmpty && (
                    <div className="pointer-events-none absolute top-6 left-4 text-sm text-gray-400">
                        {placeholder}
                    </div>
                )}
                <EditorContent editor={editor} className="overflow-y-auto" />
            </div>
        </div>
    );
}
