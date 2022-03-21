import { load } from 'js-yaml';

// TODO load from URL or clipboard instead of hardcoding
function CRD() {
  return load(`apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              description: Spec is where all fields are specified
              properties:
                cronSpec:
                  description: The cron string that specifies when this cronjob should run. See http://crontab.guru
                  type: string
                  pattern: '^(\\d+|\\*)(/\\d+)?(\\s+(\\d+|\\*)(/\\d+)?){4}$'
                image:
                  description: The full Docker image to use when running this cronjob
                  type: string
                replicas:
                  description: |
                    Sometimes cronjobs will not finish before the next one starts. Replicas allows
                    you to control how many are able to run at one time, before the oldest ones are
                    terminated to allow new ones to run.
                  type: integer
                  minimum: 1
                  maximum: 10
                suspend:
                  description: If true, the cronjob will not be run
                  type: boolean
                labels:
                  description: Extra labels to define on the cronjob pod spec.
                  type: array
                  items:
                    type: object
                    properties:
                      name:
                        description: The name of the label
                        type: string
                      value:
                        description: The label's value
                        type: string
              required:
              - cronSpec
              - image
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
`)
}

export default CRD;
