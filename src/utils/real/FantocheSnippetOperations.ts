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

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        try {
            const url = `${BACKEND_URL}/create`;
            const data = transformSnippet(createSnippet);
            const res = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
            });
            return res.data.snippetEntity; // TODO ver si esto esta bien
        } catch (e) {
            console.log("Failed to create snippet", e);
            throw e;
        }
    }

    async deleteSnippet(id: string): Promise<string> {
        try {
            const url = `${BACKEND_URL}/delete/${id}`;
            await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
            });
            return "Snippet deleted successfully";
        } catch (e) {
            console.log("Error deleting snippet", e);
            throw e;
        }
    }

    async getSnippetById(id: string): Promise<Snippet | undefined>
    {
        try {
            const url = `${BACKEND_URL}/get/${id}`;
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                }
            });
            return res.data
        } catch (e) {
            console.log("Error getting snippet", e);
            throw e;
        }
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        try {
            const url = `${BACKEND_URL}/update/${id}`;
            const res = await axios.put(url, updateSnippet, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                }
            });
            return res.data;
        } catch (e) {
            console.log("Error updating snippet", e);
            throw e;
        }
    }
    shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        throw new Error("Method not implemented.");
    }
    listSnippetDescriptors(page: number, pageSize: number, sippetName?: string | undefined): Promise<PaginatedSnippets> {
        throw new Error("Method not implemented.");
    }

    getUserFriends(name?: string | undefined, page?: number | undefined, pageSize?: number | undefined): Promise<PaginatedUsers> {
        throw new Error("Method not implemented.");
    }

    // ------------------- TEST CASES -------------------
    getTestCases(snippetId: string): Promise<TestCase[]> {
        throw new Error("Method not implemented.");
    }
    postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
        throw new Error("Method not implemented.");
    }
    removeTestCase(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        throw new Error("Method not implemented.");
    }
    getFileTypes(): Promise<FileType[]> {
        throw new Error("Method not implemented.");
    }

    // ------------------- FORMAT CASES -------------------
    getFormatRules(): Promise<Rule[]> {
        throw new Error("Method not implemented.");
    }
    modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        throw new Error("Method not implemented.");
    }
    formatSnippet(snippet: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    // ------------------- LINT CASES -------------------
    modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        throw new Error("Method not implemented.");
    }
    async getLintingRules(): Promise<Rule[]> {
        try {
            const url = `${BACKEND_URL}/lint/rules`;
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                }
            });
            return res.data;
        } catch (e) {
            console.log("Error getting linting rules", e);
            throw e;
        }
    }

}