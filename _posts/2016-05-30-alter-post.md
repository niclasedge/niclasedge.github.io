---
title: Neuer post
layout: default
categories: test
tags: test
mermaid: true
toc: true
---

# warum?
test content

tut ihr mir das an?

## unterthema

aaaaaaa

# Linux
## überschift

```python
print("test")
```

### Mermaid code

```mermaid
flowchart TD

    S(("start.py")):::white--> A0;


		subgraph Quellen
		C[amazon api];
		C2[Web scraping];
		end

		A0[[get_products.py]];
		A1[[clean_products.py]];
		A2[[Refresh_asin.py]];
		A3[[update_blog.py]];
		A5[[create_text.py]];


		A0-->A1;
		A0--Nach Keyword suchen und importieren-->C
		A1 --> A2;
		A2--asin neu abrufen und updaten-->C;
		A2-->A3



		A5 -- in DB kopieren -->C2;
		A3 --> A5;



		A5--> D((End)):::white;

    classDef white fill:#fff,stroke:#e30613, stroke-width:2px;
		classDef white1 fill:#fff,stroke:#333;
		classDef white2 	fill:#f2f3f5	,stroke:#333;
		class A0,A1,A2,A3,A4,A5,A6,A7,A8,A9 white1;
		class C,C1,C2 white2;

```

# Umgebungsvariablen in Docker

dsoijdsjd

## unterthema

# in Docker compose
mehr text