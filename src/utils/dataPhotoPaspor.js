const dataPhotoPaspor = {
  visibleImage:
    "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",
  msgType: "visibleImage",
};

export default dataPhotoPaspor;
