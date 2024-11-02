import {CreateSnippet, SnippetRequestCreate} from "../snippet.ts";

export const transformSnippet = (createSnippet: CreateSnippet): SnippetRequestCreate => {
    return {
        title: createSnippet.name,
        language: createSnippet.language,
        description: createSnippet.extension,
        code: createSnippet.content,
        version: "1.0" // TODO raro pq createSnippet no tiene version
    };
}