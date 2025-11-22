import { CitationSlider } from "./CitationSlider";

export const citation = {
  render: "Citation",
  selfClosing: true,
  attributes: {
    items: {
      type: Array,
    },
  },
};

export const Citation = (props) => {
  // group citations by name
  const citations = props.items.reduce((acc, citation) => {
    const { name } = citation;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(citation);
    return acc;
  }, {});

  return (
    <div className="interactive-citation p-4 border mt-4 flex flex-col rounded-md gap-2">
      {Object.entries(citations).map(([name, items], index) => {
        return (
          <div key={index} className="flex flex-col gap-2">
            <div className="font-semibold text-sm">{name}</div>
            <div className="flex gap-2">
              {items.map((item, index) => {
                return (
                  <div key={index}>
                    <CitationSlider index={index + 1} name={item.name} id={item.id} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
