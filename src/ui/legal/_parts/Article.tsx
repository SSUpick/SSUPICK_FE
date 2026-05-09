import type { ReactNode } from 'react';

type ArticleProps = {
    number: string;
    title: string;
    children: ReactNode;
};

export function Article({ number, title, children }: ArticleProps) {
    return (
        <section className="flex flex-col gap-10">
            <h2 className="text-black-900 text-base font-semibold tracking-tight">
                {number} {title}
            </h2>
            <div className="text-black-700 flex flex-col gap-8 text-sm leading-22 tracking-tight">
                {children}
            </div>
        </section>
    );
}

type OrderedListProps = {
    children: ReactNode;
    nested?: boolean;
};

export function OL({ children, nested = false }: OrderedListProps) {
    return (
        <ol
            className={`marker:text-black-500 flex list-decimal flex-col gap-4 ${nested ? 'pl-16' : 'pl-20'}`}
        >
            {children}
        </ol>
    );
}

type TableProps = {
    headers: string[];
    rows: ReactNode[][];
};

export function Table({ headers, rows }: TableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="border-black-300 w-full border-collapse border text-xs">
                <thead className="bg-black-100">
                    <tr>
                        {headers.map(h => (
                            <th
                                key={h}
                                className="border-black-300 text-black-800 border px-8 py-6 text-left font-semibold tracking-tight"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td
                                    key={j}
                                    className="border-black-300 text-black-700 border px-8 py-6 align-top tracking-tight"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
