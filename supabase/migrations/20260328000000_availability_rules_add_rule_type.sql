alter table availability_rules
  add column rule_type text not null default 'recurring'
    check (rule_type in ('recurring', 'specific'));
