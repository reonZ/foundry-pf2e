import { DateTime } from "luxon";

declare global {
    class WorldClock extends Application {
        get dateTheme(): "AR" | "IC" | "AD" | "CE";
        get timeConvention(): 24 | 12;
        get syncDarkness(): boolean;
        get worldCreatedOn(): DateTime;
        get worldTime(): DateTime;
    }
}
