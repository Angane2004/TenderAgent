# TenderAgent  
AI-Powered RFP Automation Platform 🚀

## EY Techathon 6.0 Hackathon Submission

Live Demo: https://tenderagent.netlify.app   

---

## Project Summary

TenderAgent automates the end-to-end RFP (Request for Proposal) process for industrial manufacturers such as wires, cables, paints, FMCG, and large OEMs.

The platform uses an **agent-based AI architecture** where specialized agents handle sales discovery, technical specification matching, pricing estimation, and proposal generation. A central Master Agent coordinates these agents to deliver faster, more accurate, and submission-ready tender responses.

The goal is to reduce manual effort, shorten response time, and improve win probability.

---

## What the System Does

- Auto-discovers and parses RFP documents  
- Matches technical specifications with internal SKUs  
- Generates pricing scenarios (aggressive, optimal, premium)  
- Calculates win probability  
- Produces a ready-to-submit proposal (PDF / Word)  

---

## High-Level Architecture

<img width="7516" height="2940" alt="Architecture Diagram" src="https://github.com/user-attachments/assets/8f93f129-bc54-4329-95a7-2d9202a66e4b" />

---

## Tech Stack

**Frontend**
- React (Next.js 15)
- TypeScript
- Tailwind CSS

**Backend**
- FastAPI (Python)
- Agent orchestration using LangGraph / LangChain

**AI & Data**
- OpenAI / Groq / Ollama (local)
- Vector search (FAISS)
- Supabase
- Playwright & Tavily for scraping

---

## Flow Chart


<img width="1558" height="1092" alt="Untitled diagram-2025-12-06-114747" src="https://github.com/user-attachments/assets/9d77380c-6c34-4111-8527-653169bcbbd0" />


---

