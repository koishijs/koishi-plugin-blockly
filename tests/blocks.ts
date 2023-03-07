// test_scope_provider , test_scope_noop , test_scope_consumer
export const TestBlocks = [
  {
    "type": "test_scope_provider",
    "message0": "provide %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "NAME"
      }
      ],
    "previousStatement": null,
    "nextStatement": null,
  },
  {
    "type": "test_scope_noop",
    "message0": "noop %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "NAME"
      }
      ],

    "previousStatement": null,
    "nextStatement": null,
  },
  {
    "type": "test_scope_consumer",
    "message0": "consume %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "NAME"
      }
      ],

    "previousStatement": null,
    "nextStatement": null,
  }
]
