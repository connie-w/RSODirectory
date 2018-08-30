library('rvest')
library('dplyr')
library('httr')

url <- 'https://uws-community.symplicity.com/index.php?s=student_group'
page <- html_session(url)

get_more_info <- function(more_info, page, xpath_input) {
  content <- html_node(jump_to(page, more_info), xpath = xpath_input) %>% html_text()
  jump_to(page, "?mode=list")
  content
}

get_table <- function(page, count) {
  
  fb_xpath <- '//*[@id="dnf_class_values_student_group__facebook__widget"]'
  desc_xpath <- '//*[@id="dnf_class_values_student_group__purpose__widget"]'
  
  #find group names
  name_text <- html_nodes(page,".grpl-name a") %>% html_text()
  df <- data.frame(name_text, stringsAsFactors = FALSE)
  
  more_info_nodes <- html_nodes(page, ".grpl-moreinfo a") %>% html_attr("href")
  df$more_info <- more_info_nodes
  
  #find text description
  df$desc <- sapply(df$more_info, get_more_info, page, desc_xpath)
  
  #find emails
  #  find the parent nodes with html_nodes
  #  then find the contact information from each parent using html_node
  email_nodes<-html_nodes(page, "div.grpl-grp") %>% html_node( ".grpl-contact a") %>% html_text()
  df$emails<-email_nodes 
  
  category_nodes <- html_nodes(page, "div.grpl-grp") %>% html_node(".grpl-type") %>% html_text()
  df$category<-category_nodes
  
  pic_nodes <-html_nodes(page, "div.grpl-grp") %>% html_node( ".grpl-logo img") %>% html_attr("src")
  df$logo <- paste0("https://uws-community.symplicity.com/", pic_nodes)
  
  df$fb <- sapply(df$more_info, get_more_info, page, fb_xpath)
  
  ending_string <- html_node(page, ".list-count") %>% html_text() %>% strsplit("[- ]+") %>% unlist()

  if(ending_string[[3]] != ending_string[[5]]) {
    return (rbind(df, get_table(page %>% follow_link(css = ".paging_nav a:last-child"), count + 1)))
  } else{
    return (df)
  }
 }


RSO_data <- data.frame(get_table(page, 0))

write.csv(RSO_data, file = "rso-data.csv")
 