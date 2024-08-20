import { DateTime } from "luxon";

declare global {
    class WorldClock extends Application {
        // private
        get era(): string;
        get year(): number;
        get month(): string;
        get weekday(): string;

        static calculateIncrement(
            wordTime: DateTime,
            interval: string,
            intervalMode: string
        ): number;

        // public
        get dateTheme(): "AR" | "IC" | "AD" | "CE";
        get timeConvention(): 24 | 12;
        get syncDarkness(): boolean;
        get worldCreatedOn(): DateTime;
        get worldTime(): DateTime;

        getData(): WorldClockData;
    }

    interface WorldClockData {
        date: string;
        time: string;
        options?: {};
        user: User;
        sign: "+" | "-";
    }
}
