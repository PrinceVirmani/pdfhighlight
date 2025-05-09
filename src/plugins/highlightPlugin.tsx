import React, { ReactElement } from "react";
import {
  createStore,
  Plugin,
  PluginOnDocumentLoad,
  PluginOnTextLayerRender,
} from "@react-pdf-viewer/core";

export enum Trigger {
  TextSelection,
  Click,
}

interface HighlightPluginProps {
  highlights: Array<{
    id: string;
    text: string;
    pageNumber: number;
    position: {
      boundingRect: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        width: number;
        height: number;
      };
      rects: Array<{
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        width: number;
        height: number;
      }>;
    };
    comment?: string;
    color: string;
    createdAt: number;
  }>;
  onHighlightClick?: (highlight: any) => void;
  onSelectionFinished?: (selection: {
    selectedText: string;
    pageNumber: number;
    position: any;
  }) => void;
  setSelectedText?: (text: string) => void;
  setSelectedPosition?: (position: any) => void;
  setSelectedPageNumber?: (pageNumber: number) => void;
  onAddHighlight?: (highlight: any) => void;
  trigger?: Trigger;
}

export const highlightPlugin = (props: HighlightPluginProps): Plugin => {
  const {
    highlights,
    onHighlightClick,
    onSelectionFinished,
    onAddHighlight,
    setSelectedText,
    trigger = Trigger.Click,
    setSelectedPosition,
    setSelectedPageNumber,
  } = props;

  const store = createStore<{
    selectedText: string;
    pageNumber: number;
    position: any;
  }>({
    selectedText: "",
    pageNumber: -1,
    position: null,
  });

  const renderHighlights = (pageNumber: number): ReactElement => {
    const pageHighlights = highlights.filter(
      (highlight) => highlight.pageNumber === pageNumber
    );

    return (
      <div>
        {pageHighlights.map((highlight) => (
          <div
            key={highlight.id}
            style={{
              position: "absolute",
              left: `${highlight.position.boundingRect.x1 * 100}%`,
              top: `${highlight.position.boundingRect.y1 * 100}%`,
              width: `${highlight.position.boundingRect.width * 100}%`,
              height: `${highlight.position.boundingRect.height * 100}%`,
              backgroundColor: highlight.color || "#ffeb3b",
              opacity: 0.4,
              cursor: "pointer",
            }}
            onClick={() => onHighlightClick && onHighlightClick(highlight)}
            title={highlight.comment || highlight.text}
          />
        ))}
      </div>
    );
  };

  const handleTextSelection = (
    e: MouseEvent,
    pageNumber: number,
    textLayerNode: HTMLElement
  ) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) {
      return;
    }

    // Get the position of the selection
    const range = selection.getRangeAt(0);
    const clientRects = range.getClientRects();
    if (clientRects.length === 0) {
      return;
    }

    // Convert client rects to relative positions
    const textLayerRect = textLayerNode.getBoundingClientRect();
    const rects = Array.from(clientRects).map((rect) => {
      const x1 = (rect.left - textLayerRect.left) / textLayerRect.width;
      const y1 = (rect.top - textLayerRect.top) / textLayerRect.height;
      const x2 = (rect.right - textLayerRect.left) / textLayerRect.width;
      const y2 = (rect.bottom - textLayerRect.top) / textLayerRect.height;
      const width = rect.width / textLayerRect.width;
      const height = rect.height / textLayerRect.height;

      return { x1, y1, x2, y2, width, height };
    });

    // Get the bounding rect
    const boundingRect = rects.reduce(
      (result, rect) => {
        return {
          x1: Math.min(result.x1, rect.x1),
          y1: Math.min(result.y1, rect.y1),
          x2: Math.max(result.x2, rect.x2),
          y2: Math.max(result.y2, rect.y2),
          width: Math.max(result.x2, rect.x2) - Math.min(result.x1, rect.x1),
          height: Math.max(result.y2, rect.y2) - Math.min(result.y1, rect.y1),
        };
      },
      {
        x1: rects[0].x1,
        y1: rects[0].y1,
        x2: rects[0].x2,
        y2: rects[0].y2,
        width: rects[0].width,
        height: rects[0].height,
      }
    );

    const position = {
      boundingRect,
      rects,
    };

    store.update("selectedText", selectedText);
    store.update("pageNumber", pageNumber);
    store.update("position", position);

    // Update the context with the selection information
    if (setSelectedText) {
      setSelectedText(selectedText);
    }

    if (setSelectedPosition) {
      setSelectedPosition(position);
    }

    if (setSelectedPageNumber) {
      setSelectedPageNumber(pageNumber);
    }

    if (onSelectionFinished) {
      onSelectionFinished({
        selectedText,
        pageNumber,
        position,
      });
    }

    // We'll only add the highlight when the user clicks the "Save Highlights" button
    // So we're removing this automatic highlight creation
    // if (trigger === Trigger.TextSelection && onAddHighlight) {
    //   onAddHighlight({
    //     text: selectedText,
    //     pageNumber,
    //     position,
    //   });
    //   selection.removeAllRanges();
    // }
  };

  // We're not using the automatic click handler anymore
  // The highlight will be created when the user clicks the "Save Highlights" button
  const handleClick = (e: MouseEvent) => {
    // This function is intentionally left empty
    // We'll handle the highlight creation in the RightSide component
  };

  return {
    onDocumentLoad: (props: PluginOnDocumentLoad) => {
      // Add click event listener to the viewer container
      if (trigger === Trigger.Click) {
        // We'll add the click listener to the document instead
        document.addEventListener("click", handleClick);
      }
    },
    onTextLayerRender: (e: PluginOnTextLayerRender) => {
      // Access the text layer element - using type assertion to avoid TypeScript errors
      // Different versions of the library might use different property names
      const textLayerNode = e.ele as HTMLElement;

      // If textLayerNode is undefined, we can't proceed
      if (!textLayerNode) {
        console.error("Text layer node not found");
        return;
      }
      const pageNumber = e.pageIndex + 1;

      // Add mouseup event listener to detect text selection
      textLayerNode.addEventListener("mouseup", (mouseEvent: MouseEvent) => {
        handleTextSelection(mouseEvent, pageNumber, textLayerNode);
      });

      // Render existing highlights
      const highlightsContainer = document.createElement("div");
      highlightsContainer.className = "highlight-layer";
      highlightsContainer.style.position = "absolute";
      highlightsContainer.style.left = "0";
      highlightsContainer.style.top = "0";
      highlightsContainer.style.width = "100%";
      highlightsContainer.style.height = "100%";
      highlightsContainer.style.pointerEvents = "none";

      const pageHighlights = highlights.filter(
        (highlight) => highlight.pageNumber === pageNumber
      );
      pageHighlights.forEach((highlight) => {
        highlight.position.rects.forEach((rect) => {
          const highlightEle = document.createElement("div");
          highlightEle.style.position = "absolute";
          highlightEle.style.left = `${rect.x1 * 100}%`;
          highlightEle.style.top = `${rect.y1 * 100}%`;
          highlightEle.style.width = `${rect.width * 100}%`;
          highlightEle.style.height = `${rect.height * 100}%`;
          highlightEle.style.backgroundColor = highlight.color || "#ffeb3b";
          highlightEle.style.opacity = "0.4";
          highlightEle.style.pointerEvents = "auto";
          highlightEle.style.cursor = "pointer";
          highlightEle.title = highlight.comment || highlight.text;

          highlightEle.addEventListener("click", (e) => {
            e.stopPropagation();
            if (onHighlightClick) {
              onHighlightClick(highlight);
            }
          });

          highlightsContainer.appendChild(highlightEle);
        });
      });

      const textLayer = textLayerNode;
      const parentNode = textLayer.parentNode;
      if (parentNode) {
        parentNode.insertBefore(highlightsContainer, textLayer.nextSibling);
      }
    },
  };
};
