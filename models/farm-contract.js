const address = "0x29C4A96225D5AFD91D0FA44973e933eaf1cFcE91";
const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "plan_name",
        type: "string",
      },
    ],
    name: "PlanCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "PlanUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "plan_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "task_type",
        type: "string",
      },
    ],
    name: "TaskSummaryUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "plan_id",
        type: "uint256",
      },
    ],
    name: "approvePlan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "caring_task_summaries",
    outputs: [
      {
        internalType: "uint256",
        name: "plan_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "total_tasks",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "overall_status",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "last_updated",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "plant_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "yield_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expert_id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "plan_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "start_date",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end_date",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "estimated_product",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "qr_code",
        type: "string",
      },
    ],
    name: "createPlan",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "plan_id",
        type: "uint256",
      },
    ],
    name: "getPlan",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "plant_id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "yield_id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expert_id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "plan_name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "start_date",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "end_date",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "status",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "estimated_product",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "qr_code",
            type: "string",
          },
          {
            internalType: "bool",
            name: "is_approved",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "caring_task_count",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "harvesting_task_count",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "packaging_task_count",
            type: "uint256",
          },
        ],
        internalType: "struct IPlanManagement.Plan",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "harvesting_task_summaries",
    outputs: [
      {
        internalType: "uint256",
        name: "plan_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "total_tasks",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "overall_status",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "total_harvested_quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "last_updated",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "packaging_task_summaries",
    outputs: [
      {
        internalType: "uint256",
        name: "plan_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "total_tasks",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "total_packed_quantity",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "overall_status",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "last_updated",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "plan_id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "status",
        type: "string",
      },
    ],
    name: "updatePlanStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

module.exports = { address, abi };
