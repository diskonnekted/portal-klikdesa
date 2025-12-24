// Server component untuk tanggal event
interface EventDateProps {
    event: {
        id: number;
        nama: string;
        tanggal: string;
        waktu: string;
        lokasi: string;
        kategori: string;
    };
}

export function EventDate({ event }: EventDateProps) {
    // Parse tanggal sekali untuk konsistensi
    const date = new Date(event.tanggal);

    return (
        <div className="text-center bg-primary/10 rounded-lg p-2 min-w-[60px]">
            <div className="text-lg font-bold text-foreground">{format(date, "dd")}</div>
            <div className="text-xs text-muted-foreground">{format(date, "MMM")}</div>
        </div>
    );
}

function format(date: Date, formatStr: string): string {
    const options: Intl.DateTimeFormatOptions = {};

    if (formatStr === "dd") {
        options.day = "numeric";
    } else if (formatStr === "MMM") {
        options.month = "short";
    }

    return date.toLocaleDateString("id-ID", options);
}
