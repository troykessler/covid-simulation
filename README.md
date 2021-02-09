# Covid-9 Simulation

## Worum geht es?

Dieses Projekt wurde für eine Bachelorarbeit mit dem Titel `"Entwurf und Implementierung einerEpidemien-Simulation zur Evaluation und Bewertungvon verschiedenen Maßnahmen gegen COVID-19"` erstellt. Es handelt sich hier um ein
visuelles Simulationsprogramm, mit dem man die Ausbreitungsdynamik von Covid-19 und anderen Krankheiten spielerisch
erforschen kann. Zusätzlich ist es möglich Maßnahmen wie Maskenpflicht, physische Distanzierung, Schließung
von zentralen Einrichtungen, Reisebeschränkungen, Grenzschließungen und viele weitere zu erforschen.
Dabei gibt es viele Parameter, die genaustens definiert werden können, sodass man beliebig viele Szenarien erstellen
kann.

## Wo befindet sich es?

Das Projekt kann unter folgendem Link gefunden werden: `https://gifted-einstein-2065af.netlify.app/#/`.

Das Projekt wurde mithilfe von [Netlify](https://www.netlify.com/) deployed.

## Wie kann man das Projekt starten?

### node_modules installieren

```
yarn install
```

### Im Entwicklungsmodus starten

```
yarn serve
```

Nun sollte die Applikation unter http://localhost:8080/ erreichbar sein.

## Welche Technologien wurden verwendet?

Hier handelt es sich um ein reines Frontendprojekt, als Framework wurde dafür [Vue 3](https://v3.vuejs.org/)
genutzt. Als Animationslibrary wurde [p5.js](https://p5js.org/) verwendet. Weiterhin wurde für das Design
[tailwindcss](https://tailwindcss.com/) genutzt.

## Kann ich dazu beitragen?

Dieses Projekt dient in erster Linie der Bildung, dafür ist es auch öffentlich zugänglich. Gerne können Pull-Requests
erstellt, oder das Projekt geforked werden. Es gibt viele Parameter und Maßnahmen (Beispielsweise Impfungen), welche
nicht in dieser Simulation implementiert wurden, diese könnten somit ergänzt und erweitert werden.
