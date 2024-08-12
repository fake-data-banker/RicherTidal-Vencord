/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 OpenAsar
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Link } from "@components/Link";
import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";
import { Forms } from "@webpack/common";
const appIds = [
    "584458858731405315",
];
const logger = new Logger("richerTidal");
export default definePlugin({
    name: "richerTidal",
    description: "Enhances tidalRPC (More details in info button) by adding the \"Listening to\" type prefix to the user's rich presence when an applicable ID is found.",
    authors: [{
        id: 1203847102342496397,
        name: "Kuri",
    },
    ],
    start() {
        logger.debug("Plugin started");
    },
    patches: [
        {
            find: '="LocalActivityStore",',
            replacement: {
                match: /LOCAL_ACTIVITY_UPDATE:function\((\i)\)\{/,
                replace: "$&$self.patchActivity($1.activity);",
            }
        },
        {
            find: "}renderTimeBar(",
            replacement: {
                match: /renderTimeBar\((.{1,3})\){.{0,50}?let/,
                replace: "renderTimeBar($1){let"
            }
        }
    ],
    settingsAboutComponent: () => (
        <>
            <Forms.FormTitle tag="h3">Requirements</Forms.FormTitle>
            <Forms.FormText>
                You will need <Link href="https://tidal.com">Tidal</Link> along with <Link href="https://github.com/BitesizedLion/TidalRPC">tidalRPC</Link>
            </Forms.FormText>
            <br></br>
            <Forms.FormTitle tag="h3">What is Tidal?</Forms.FormTitle>
            <Forms.FormText>
                Tidal is a Norwegian-American music streaming service.
            </Forms.FormText>
        </>
    ),
    patchActivity(activity: { application_id: string; type: number; }) {
        if (appIds.includes(activity?.application_id)) {
            logger.debug("Found a matching application ID, correcting activity type");
            activity.type = 2; /* LISTENING type */
        }
    },
});
