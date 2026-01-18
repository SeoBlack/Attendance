# Presentation Plan: Code Generation with AI (Focus on Agents)

**Topic:** Code Generation with AI: Productivity Booster or Technical Debt?  
**Timing:** 25 minutes  
**participants:** Soreen, Viswak, Olga, Lev  

---

## Presentation Structure

### 1. Introduction (1-2 minutes)
*   **Speaker:** (Soreen/Whoever goes first)
*   **Content:**
    *   **Key Thesis:** Distinguish concepts. AI Chats (ChatGPT, Claude web) are for ideas, brainstorming, and architectural discussions. **Do not use chats for writing code.**
    *   Main Presentation Topic: **AI Agents** and integrated tools (Cursor, Claude Code, GitHub Copilot, Codex, IDE extensions).
    *   Why Agents? Because they see the project context, not just an isolated snippet.

### 2. Part 1: From Chats to Agents: A New Level of Productivity
*   **Speaker:** Soreen Oraibi (presumably)
*   **Time:** ~5-6 minutes
*   **Key Points:**
    *   Why Copy-Paste from ChatGPT is a bad practice (loss of context, outdated libraries).
    *   What is **Agentic AI** in development: tools that work "inside" the project.
    *   How Agents accelerate work:
        *   Understanding dependencies between files.
        *   Automated refactoring.
        *   Test generation based on real project code.

### 3. Part 2: Risks of the Agentic Approach (Security & Correctness)
*   **Speaker:** Olga Shomarova (presumably)
*   **Time:** ~5-6 minutes
*   **Key Points:**
    *   **Security:** Agents have access to all code. What if they "leak" private keys or logic?
    *   **Hallucinations on steroids:** An agent might generate not just one bad function, but create an entire structure with a flaw.
    *   The "Blind Trust" problem: when the agent does everything itself, the developer stops verifying changes.

### 4. Part 3: Technical Debt in the Age of Agents
*   **Speaker:** Viswak Ggautham (presumably)
*   **Time:** ~5-6 minutes
*   **Key Points:**
    *   Agents can generate code faster than humans can comprehend it.
    *   Risk of creating "Frankenstein Code": a mix of styles that is hard to maintain.
    *   Who will fix bugs a year from now? If the code was written by an Agent, does the team know how it works?

### 5. Part 4: Real World Experience: Managing Agents (Context & Efficiency)
*   **Speaker:** Lev Karavanov
*   **Time:** ~5-6 minutes
*   **Key Points:**
    *   **Context is King (Documentation as Fuel):**
        *   Documentation is not bureaucracy, but context for the agent. Preparing docs *before* coding starts.
        *   Regular documentation updates to preserve context (otherwise the agent loses the project thread).
    *   **Technical Stack (Advanced Tooling):**
        *   Using **MCP (Model Context Protocol)**: connecting agents directly to GitHub, databases.
        *   Cycle: Generation -> Auto-testing -> Fixes (without human intervention in intermediate stages).
    *   **Challenges & Problems (Agent Management):**
        *   **Economics:** API costs and token control (avoiding "mindless burning").
        *   **Context Hygiene:** The art of context management. Not bloating the prompt with unnecessary info.
        *   **Model Selection:** Strategy for choosing the model for the task (cheap models for routine vs smart models for architecture).
    *   **Scope of Application & Role of Juniors (Best Fit):**
        *   **Where Agents are Essential:** Prototypes, MVPs, Pet-projects. Projects where the path from "Idea -> Deploy" needs to be maximally fast, and where architectural flaws are forgiven.
        *   **Junior Developers:** They are not disappearing. Building MVPs with agents *is* the new job of a junior. The agent is an "exoskeleton" that allows a junior to deliver middle-level results at the start.

### 6. Conclusion: The New Developer Profile (1-2 minutes)
*   **Speaker:** All or Lev (as closer)
*   **Content:**
    *   **Paradigm Shift:** The developer stops being a "Code Writer" and becomes an "Architect" and "Orchestrator".
    *   **New Hard Skills to Cultivate:**
        *   **Architecture First:** Ability to design systems, since AI writes code but doesn't build the system.
        *   **Code Reading:** A critically important skill — being able to quickly read and understand someone else's (generated) code.
        *   **Tooling & Ops:** Deep understanding of environment setup (IDE, MCP servers, agent configs).
        *   **DevOps:** AI is still weak in infrastructure, deployment, and "hardware" — this remains on the human.
    *   **Final Verification:** AI will not replace developers, but developers with AI will replace those without it.
