import {SnippetOperations} from "../snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "../snippet.ts";
import {FileType} from "../../types/FileType.ts";
import {Rule} from "../../types/Rule.ts";
import {TestCase} from "../../types/TestCase.ts";
import {TestCaseResult} from "../queries.tsx";
import {PaginatedUsers} from "../users.ts";
import {BACKEND_URL} from "../constants.ts";
import axios from "axios";
import {transformSnippet} from "../conversion/conversion.ts";

export class FantocheSnippetOperations implements SnippetOperations {

    private token = localStorage.getItem("token");

    listSnippetDescriptors(page: number, pageSize: number, sippetName?: string | undefined): Promise<PaginatedSnippets> {
        throw new Error("Method not implemented.");
    }
    getSnippetById(id: string): Promise<Snippet | undefined> {
        throw new Error("Method not implemented.");
    }
    updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        throw new Error("Method not implemented.");
    }
    getUserFriends(name?: string | undefined, page?: number | undefined, pageSize?: number | undefined): Promise<PaginatedUsers> {
        throw new Error("Method not implemented.");
    }
    shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        throw new Error("Method not implemented.");
    }
    getFormatRules(): Promise<Rule[]> {
        throw new Error("Method not implemented.");
    }
    getLintingRules(): Promise<Rule[]> {
        throw new Error("Method not implemented.");
    }
    getTestCases(snippetId: string): Promise<TestCase[]> {
        throw new Error("Method not implemented.");
    }
    formatSnippet(snippet: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
        throw new Error("Method not implemented.");
    }
    removeTestCase(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    deleteSnippet(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        throw new Error("Method not implemented.");
    }
    getFileTypes(): Promise<FileType[]> {
        throw new Error("Method not implemented.");
    }
    modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        throw new Error("Method not implemented.");
    }
    modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        throw new Error("Method not implemented.");
    }
    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        // adapt CreateSnippet to SnippetRequestCreate
        // get the create endpoint url (base from .env and + /create)
        // usar axios para pegarle al endpoint con ladata y pasarle x headers el token
        try {
            const url = `${BACKEND_URL}/create`;
            const data = transformSnippet(createSnippet);
            const res = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
            });
            return res.data;
        } catch (e) {
            console.log("Failed to create snippet", e);
            throw e;
        }
    }
}